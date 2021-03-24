import * as config from "config";

interface IConfig {
    homeserverUrl: string;
    pantalaimon: {
        use: boolean;
        username: string;
        password: string;
    };
    accessToken: string;
    autoJoin: boolean;
    dataPath: string;
}

export default <IConfig>config;
