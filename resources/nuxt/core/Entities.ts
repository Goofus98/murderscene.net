export interface ServersTransfer{
    ip: string;
    port: number;
    name: string;
    description: string;
    gamemode: string;
    map: string;
    players: number;
    maxPlayers: number;
}


export class Servers {

    constructor(public ip: string, public port:number, public name: string, public description:string, public gamemode:string, public players:number, public maxPlayers:number){}

    static hydrate(xf: ServersTransfer){
        return new Servers(xf.ip, xf.port, xf.name, xf.description, xf.gamemode, xf.players, xf.maxPlayers);
    }
}



export interface SteamUserTransfer{
    steamid: string;
    name: string;
    avatar: string;

    created_at: string;
    updated_at: string;
}


export class SteamUser {

    constructor(public steamid: string, public name:string, public avatar: string, public created_at: string, public updated_at: string){}

    static hydrate(xf: SteamUserTransfer){
        return new SteamUser(xf.steamid, xf.name, xf.avatar, xf.created_at, xf.updated_at);
    }
}


export interface StaffTransfer{
    steamid: string;
    profile: string;
    name: string;
    rank: string;
}


export class Staff {

    constructor(public steamid: string, public profile:string, public name: string, public rank: string){}

    static hydrate(xf: StaffTransfer){
        return new Staff(xf.steamid, xf.profile, xf.name, xf.rank);
    }
}



export interface MoneyTransfer{
    gp: BigInteger;
    name: string;
    avatar: string;
}

export class Money {

    constructor(public gp: BigInteger, public avatar:string, public name: string,){}

    static hydrate(xf: MoneyTransfer){
        return new Money(xf.gp, xf.avatar, xf.name);
    }
}
