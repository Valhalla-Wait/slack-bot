export interface QueryDataI {
    rukovoditel: string,
    sotrudniki: {
        [key: string]: SotrudnikI
    }
}

interface SotrudnikI {
    name: string
    email: string
    birthday: string
}