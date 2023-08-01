export class Conexion {

    private IP : string = "localhost";
    private PORT : String =  "44358";

    
    Url() : string{
        return "https://"+this.IP+":"+this.PORT+"/api/"; 
    }

    /*private IP : string = "192.168.0.118";
    private PORT : String =  "130";



    Url() : string{
        return "http://"+this.IP+":"+this.PORT+"/api/"; 
    }*/

    /*private IP : string = "165.98.96.131";
    private PORT : String =  "130";



    Url() : string{
        return "http://"+this.IP+":"+this.PORT+"/api/"; 
    }*/


}