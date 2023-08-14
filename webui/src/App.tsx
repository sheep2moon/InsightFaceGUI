// import { useState } from "react";
import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useMutation } from "react-query";
import CroppedImage from "./components/ui/CroppedImage";
import { cn } from "./lib/utils";

function App() {
    // const [count, setCount] = useState(0);
    const [targetImage, setTargetImage] = useState<null | File>(null);
    const [detectedFaces, setDetectedFaces] = useState<Array<number[]>>([]);
    const [selectedFaceIndexes, setSelectedFaceIndexes] = useState<Array<number>>([]);

    const uploadFileMutation = useMutation(async (file: File) => {
        const formData = new FormData();
        formData.append("image", file, file.name);
        const response = await fetch("http://127.0.0.1:5000/upload-target", {
            method: "POST",
            body: formData
        });
        const data: {
            faces_bbox: number[][];
            faces_count: number;
        } = await response.json();
        console.log(data);
        setDetectedFaces(data.faces_bbox);
    });

    const handleDestImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFaceIndexes([]);
        setDetectedFaces([]);
        const inputFile = e.currentTarget.files?.[0];
        if (inputFile) {
            setTargetImage(inputFile);
            uploadFileMutation.mutate(inputFile);
        }
    };

    const handleSelectFace = (index: number) => {
        setSelectedFaceIndexes(prev => {
            return prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
        });
    };

    return (
        <>
            <main className="flex flex-col gap-4">
                <h3 className="text-left text-xl font-bold border-b-4 border-indigo-600">Wybierz zdjęcie</h3>
                <Input onChange={handleDestImageChange} id="picture" type="file" />
                {targetImage && <img src={URL.createObjectURL(targetImage)} className="h-96 aspect-video object-contain" />}
                <h3 className="text-left text-xl font-bold border-b-4 border-indigo-600">Wybierz twarze do zamiany</h3>
                <div className="flex gap-1 flex-wrap">
                    {targetImage &&
                        detectedFaces.map((bbox, index) => {
                            return (
                                <div
                                    onClick={() => handleSelectFace(index)}
                                    className={cn("rounded-md hover:scale-105 transition-transform border-2 border-transparent", selectedFaceIndexes.includes(index) && "border-2 border-indigo-500")}
                                    key={`face-${index}`}
                                >
                                    <CroppedImage imageUrl={URL.createObjectURL(targetImage)} topLeft={{ x: bbox[0], y: bbox[1] }} bottomRight={{ x: bbox[2], y: bbox[3] }} />
                                </div>
                            );
                        })}
                </div>
                <Button className="mt-12">Zamień</Button>
            </main>
        </>
    );
}

export default App;
