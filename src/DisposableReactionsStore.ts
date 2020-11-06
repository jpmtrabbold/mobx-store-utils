import { autorun, IReactionPublic, reaction, runInAction } from "mobx"

type Disposer = () => any

class DummyReaction implements IReactionPublic {
    dispose(): void {
        throw new Error("Please do not use the disposing reaction with DisposableReactionsStore, as the disposers will be called automatically.")
    }
    trace(): void {
        throw new Error("Please do not use 'trace' with DisposableReactionsStore, as the disposers will be called automatically.")
    }
}
const dummyReaction = new DummyReaction()

/** a store that `useStore` uses so you can register autoruns and reactions on your store, and useStore will dispose them automatically on unmount */
export default class DisposableReactionsStore {
    disposers = [] as Disposer[]
    dispose = () => {
        for (const disposer of this.disposers) {
            disposer()
        }
    }
    registerDisposer(disposer: Disposer) {
        this.disposers.push(disposer)
    }

    registerReaction = (...params: Parameters<typeof reaction>) => {
        this.registerDisposer(reaction(...params))
    }
    registerReactionAndRunImmediately = (...params: Parameters<typeof reaction>) => {
        this.registerDisposer(reaction(...params))
        runInAction(() => params[1](params[0](dummyReaction), dummyReaction, dummyReaction))
    }

    registerAutorun = (...params: Parameters<typeof autorun>) => {
        this.registerDisposer(autorun(...params))
    }

    registerAutorunAndRunImmediately = (...params: Parameters<typeof autorun>) => {
        this.registerDisposer(autorun(...params))
        runInAction(() => params[0](dummyReaction))
    }

}