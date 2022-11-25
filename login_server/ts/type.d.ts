interface Content {
    type: Rpc;
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
