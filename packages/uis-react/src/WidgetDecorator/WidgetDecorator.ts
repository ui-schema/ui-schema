import React from 'react'

export class ReactDeco<PG extends {}, PG0 extends {} = PG, PIN extends {} = {}> {
    private readonly decorators: any[] = []

    public use<D extends (p: PG) => unknown>(
        decorator: D,
    ): ReactDeco<
        D extends (p: any) => React.ReactElement<infer R> ? R & PG :
            D extends (p: any) => React.ReactElement<infer R> | null ? R & PG : PG,
        PG0,
        D extends (p: any) => React.ReactElement<infer R> ? Omit<R, keyof PG> & PIN :
            D extends (p: any) => React.ReactElement<infer R> | null ? Omit<R, keyof PG> & PIN : PIN
    > {
        // to allow omitting props, the PG mustn't be used on inferring,
        // plugin typings require careful crafting to not have any/loose/missing props
        // BUT without it, the "collecting all yet existing" isn't possible here
        //     and this is impossible to type with the desired modularity inside the Plugins themselves (inside = not using PG, only R)
        this.decorators.push(decorator)
        return this
    }

    public next = (currentIndex: number) => {
        // note: it is important to use an arrow function here, this way it doesn't need extra `bind` calls
        return this.decorators[currentIndex]
    }
}

export type DecoratorPropsInjected<TDeco extends ReactDeco<{}, {}>> = TDeco extends ReactDeco<infer TPropsInjected, any> ? TPropsInjected : {}
export type DecoratorPropsDefault<TDeco extends ReactDeco<{}, {}>> = TDeco extends ReactDeco<any, infer TPropsDefault> ? TPropsDefault : {}
export type DecoratorProps<P extends {}, TDeco extends ReactDeco<{}, {}>> =
    Omit<
        P & DecoratorPropsDefault<TDeco>,
        keyof Omit<DecoratorPropsInjected<TDeco>, keyof DecoratorPropsDefault<TDeco>>
    >

/**
 * @internal do not use it to type decorators, as they must be generic on their own
 */
export type ReactBaseDecorator<P1 extends DecoratorPropsNext> = <P extends P1>(p: P) => React.ReactElement | null

export type DecoratorNextFn<P = {}> = <P2 extends P>(currentIndex: number) => ReactBaseDecorator<DecoratorPropsNext & P2>

export interface DecoratorPropsNext {
    decoIndex: number
    next: DecoratorNextFn
}
