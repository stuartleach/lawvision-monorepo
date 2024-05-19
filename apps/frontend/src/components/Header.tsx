import { FC } from 'react';

const Header: FC = () => {
    return (
        <header className="mb-5">
            <h1 className="text-2xl font-extrabold font-mono">LawVision AI</h1>
            <h2 className="font-mono pt-4">
                <p>Judges decide cases not necessarily based explicitly on statutes, but based on the facts of the case and how those facts relate to established precedent (i.e. case law).</p><br />
                <p>This application helps a user see relationships between cases, giving more cited cases more weight, which affects the visual representation of the node.</p>
            </h2>
        </header>
    );
}

export default Header;
