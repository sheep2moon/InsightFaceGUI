// import { useState } from "react";
import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
    // const [count, setCount] = useState(0);
    const [destImage, setDestImage] = useState<null | FIl>(null);

    const handleDestImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputFile = e.currentTarget.files?.[0];
        console.log(inputFile);

        if (inputFile) setDestImage(inputFile);
    };

    return (
        <>
            <main>
                <form action="">
                    <Label htmlFor="picture">Picture</Label>
                    <Input onChange={handleDestImageChange} id="picture" type="file" />
                    <div className="relative w-96 aspect-video">{destImage && <img src={URL.createObjectURL(destImage)} className="object-contain absolute inset-0" />}</div>
                </form>
                <Button>Oki</Button>
            </main>
        </>
    );
}

export default App;
