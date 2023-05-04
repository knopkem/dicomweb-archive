import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ScpService } from './scp.service';
import { StudiesModule } from '../studies/studies.module';

async function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout( () => {
      resolve("");
    }, time);
  });
}

@Module({
  imports: [StudiesModule],
  providers: [ScpService]
})
export class ScpModule implements OnModuleInit, OnModuleDestroy {


  constructor(private readonly scp: ScpService) {
  }

  onModuleInit() {


      sleep(1000).then( ()=> {
      console.log(this.scp.getClients());
    });
    this.scp.listen(9999);
  }

  onModuleDestroy() {
    this.scp.close();
  }

}
