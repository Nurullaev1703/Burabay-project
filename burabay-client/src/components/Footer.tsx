import {FC, HTMLAttributes} from "react"

export const Footer:FC<HTMLAttributes<HTMLElement>> = function Footer(props){

    return <footer className={`py-3 ${props.className} fixed left-0 bottom-0 w-full`}>
        {props.children}
    </footer>
}