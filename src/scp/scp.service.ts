import { Injectable, Logger } from '@nestjs/common';
import { association, Client, constants, Dataset, requests, responses, Scp, Server } from 'dcmjs-dimse';
import { Socket } from 'net';
import path from 'path';
import { StudiesService } from '../studies/studies.service';


const { CEchoRequest, CFindRequest, CStoreRequest } = requests;
const { CEchoResponse, CFindResponse, CStoreResponse } = responses;
const {
  PresentationContextResult,
  RejectReason,
  RejectResult,
  RejectSource,
  SopClass,
  Status,
  StorageClass,
  TransferSyntax,
  UserIdentityType,
} = constants;



export class ScpServer extends Scp {
    association: association.Association | undefined;
    logger: Logger;
    studiesService: StudiesService;
  
    constructor(socket: Socket, opts: any) {
      super(socket, opts);
      this.association = undefined;
      this.logger = new Logger('ScpService');
    }

    setStudyService(service: StudiesService) {
        this.studiesService = service;
    }

    associationRequested(association: association.Association) {
      this.association = association;
  
      /*
      // Evaluate calling/called AET and reject association, if needed
      if (this.association.getCallingAeTitle() !== 'CONQUESTSRV1') {
        this.sendAssociationReject(
          RejectResult.Permanent,
          RejectSource.ServiceUser,
          RejectReason.CallingAeNotRecognized
        );
        return;
      }
      */
  
      const contexts = association.getPresentationContexts();
      contexts.forEach((c) => {
        const context = association.getPresentationContext(c.id);
        if (
          context.getAbstractSyntaxUid() === SopClass.Verification ||
          context.getAbstractSyntaxUid() === SopClass.StudyRootQueryRetrieveInformationModelFind ||
          context.getAbstractSyntaxUid() === SopClass.ModalityWorklistInformationModelFind ||
          Object.values(StorageClass).includes(context.getAbstractSyntaxUid())
        ) {
          const transferSyntaxes = context.getTransferSyntaxUids();
          transferSyntaxes.forEach((transferSyntax) => {
            if (
              transferSyntax === TransferSyntax.ImplicitVRLittleEndian ||
              transferSyntax === TransferSyntax.ExplicitVRLittleEndian
            ) {
              context.setResult(PresentationContextResult.Accept, transferSyntax);
            } else {
              context.setResult(PresentationContextResult.RejectTransferSyntaxesNotSupported);
            }
          });
        } else {
          context.setResult(PresentationContextResult.RejectAbstractSyntaxNotSupported);
        }
      });
      this.sendAssociationAccept();
}

cEchoRequest(
    request: requests.CEchoRequest,
    callback: (response: responses.CEchoResponse) => void
  ) {
    const response = CEchoResponse.fromRequest(request);
    response.setStatus(Status.Success);
    callback(response);
  }

  cFindRequest(
    request: requests.CFindRequest,
    callback: (responses: Array<responses.CFindResponse>) => void
  ) {
    this.logger.log(request.getDataset());

    const response1 = CFindResponse.fromRequest(request);
    response1.setDataset(new Dataset({ PatientID: '12345', PatientName: 'JOHN^DOE' }));
    response1.setStatus(Status.Pending);

    const response2 = CFindResponse.fromRequest(request);
    response2.setStatus(Status.Success);

    callback([response1, response2]);
  }

  cStoreRequest(
    request: requests.CStoreRequest,
    callback: (response: responses.CStoreResponse) => void
  ) {
    this.logger.log(request.getDataset());

    const response = CStoreResponse.fromRequest(request);
    response.setStatus(Status.Success);
    callback(response);
  }

  associationReleaseRequested() {
    this.sendAssociationReleaseResponse();
  }
}

@Injectable()
export class ScpService extends Server {
    constructor(private readonly studiesService: StudiesService) {
        super(ScpServer);
    }

    getClients() {
        // @ts-ignore
        return this['clients'];
    }
}