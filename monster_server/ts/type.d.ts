interface Content {
    type: RpcType;
    body: string;
    name: string;
    target?: string;
    success?: boolean;
    isGameOver?: boolean;
}

interface P {
    id: number;
    name: string;
    feather: boolean;
    title: string[];
}

interface M {
    id: number;
    name: string;
    hp: number;
    ks: string;
    bornAt?: number;
}
