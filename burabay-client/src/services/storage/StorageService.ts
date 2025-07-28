export class StorageService<T>{
    private readonly KEY_STORAGE: string;

    constructor(key: string){
        this.KEY_STORAGE = key
    }

    getValue():T{
        const value = localStorage.getItem(this.KEY_STORAGE)

        if(!value){
            throw Error(`${this.KEY_STORAGE} does not exist`)
        }

        return JSON.parse(value) as T
    }

    setValue(value: T) {
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(value));
      
        if (
          typeof window !== "undefined" &&
          window.webkit?.messageHandlers?.authTokenHandler?.postMessage
        ) {
          window.webkit.messageHandlers.authTokenHandler.postMessage(this.KEY_STORAGE);
        }
      }
      
      

    hasValue(){
        return localStorage.getItem(this.KEY_STORAGE) !== null
    }
    deleteValue(){
        localStorage.removeItem(this.KEY_STORAGE)
    }
    
}