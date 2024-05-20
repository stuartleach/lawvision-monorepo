import {FC} from 'react';

import Logo from "../assets/lv_logo_1.svg";

export function TopBar() {


    return (<div className={"p-10"}>
        <img src={Logo} style={{maxHeight: "500px", margin: "0 auto"}} />
    </div>)
}

const Header: FC = () => {
    return (
        <header className="mb-5">

            <h1 className="text-2xl font-extrabold font-mono">LawVision</h1>
            <h2 className="font-mono pt-4">
                <p>Judges decide cases not necessarily based explicitly on statutes, but based on the facts of the case
                    and how those facts relate to established precedent (i.e. case law).</p><br/>
                <p>This application helps a user see relationships between cases, giving more cited cases more weight,
                    which affects the visual representation of the node.</p>
            </h2>

        </header>
    );
}

export default Header;
