export class Chat{
    et?: number; //timestamp
    ml?: {
        [key: string]: {
            dcn?: string;
            dm?: string;
            id?: string;
            message?: string;
            op?: {avatar?: string; id: number, name?: string};
            seen?: string;
            sender?: string;
            utime?: number;
        };
    };
    st?: number; //timestamp
}