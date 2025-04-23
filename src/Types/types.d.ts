import { Connection } from "mongoose"
declare global{
    var mongoose:{
        conn:Connection | null, //connection may be null
        promise:Promise<Connection> | null,  //promise may hv many promises
        //but to be specific we want Promise type of Connection.
    }
}
export {};