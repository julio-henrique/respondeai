import { ButtonHTMLAttributes } from "react"

import "../styles/button.scss"

type ButtonTypes = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonTypes) {
    return (
        <button className="button" {...props} />
    )
}
