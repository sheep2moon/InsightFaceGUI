import React, { useEffect, useRef } from "react";

export type Position = {
    x: number;
    y: number;
};
type CroppedImageProps = {
    imageUrl: string;
    topLeft: Position;
    bottomRight: Position;
};

const CroppedImage = ({ imageUrl, topLeft, bottomRight }: CroppedImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            console.log(bottomRight, topLeft);
            canvas.width = 200;
            canvas.height = 200;
            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            const hRatio = canvas.width / width;
            const vRatio = canvas.height / height;
            const ratio = Math.min(hRatio, vRatio);

            if (context) {
                const centerShift_x = (canvas.width - width * ratio) / 2;
                const centerShift_y = (canvas.height - height * ratio) / 2;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, topLeft.x, topLeft.y, width, height, centerShift_x, centerShift_y, width * ratio, height * ratio);
            }
            // canvas.width = width;
            // canvas.height = height;

            // if (context) {
            //     context.drawImage(image, topLeft.x, topLeft.y, width, height, 0, 0, width, height);
            // }
        };
    }, [imageUrl, topLeft, bottomRight]);

    return <canvas className="inline-block" ref={canvasRef} />;
};

export default CroppedImage;
