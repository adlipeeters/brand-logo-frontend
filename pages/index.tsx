import Image from "next/image";
import { Inter } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { GridLoader } from "react-spinners";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setPreviewUrl(null);
    setProcessedImage(null);
    setImageUrl("");
    const imageInput = document.getElementById('picture') as HTMLInputElement;
    if (imageInput) {
      imageInput.value = '';
    }
  }

  const getHello = async () => {
    try {
      const response = await axios.get("https://brand-logo.andreidev.site/hello");
      console.log(response.data); // Log the actual response data
    } catch (error) {
      console.error("Error fetching data:", error); // Error handling
    }
  };

  const predictImage = async () => {
    setProcessedImage(null);
    if (imageUrl) {
      predictImageFromUrl();
      return;
    }
    const imageInput = document.getElementById('picture') as HTMLInputElement;
    if (imageInput && imageInput.files && imageInput.files[0]) {
      setIsLoading(true);
      const file = imageInput.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('https://brand-logo.andreidev.site/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProcessedImage(`data:image/jpeg;base64,${response.data.image_base64}`);
      } catch (error) {
        // console.error('Error sending file:', error);
        toast({
          title: "Error",
          description: "Error sending file",
        })
      }
      finally {
        setIsLoading(false);
      }
    } else {
      // console.log("No file selected or file input not found.");
      toast({
        title: "Error",
        description: "No file selected or file input not found",
      })
    }
  };
  // https://brand-logo.andreidev.site/predict_url
  const predictImageFromUrl = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://brand-logo.andreidev.site/predict_url', {
        image_url: imageUrl,
      });
      setProcessedImage(`data:image/jpeg;base64,${response.data.image_base64}`);
    } catch (error) {
      // console.error('Error sending file:', error);
      toast({
        title: "Error",
        description: "Error sending file",
      })
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} relative`}>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50 z-50">
          <GridLoader color="#000000" />
        </div>
      )}
      <div className="container flex flex-col">
        <div className="flex items-center gap-4 justify-center flex-col">
          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
            <p className="text-center py-3">
              Or paste an image URL below
            </p>
            <Input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <Button onClick={predictImage} className="w-full mt-5">Send for Prediction</Button>
            <Button variant={"destructive"} onClick={reset} className="w-full mt-5">Reset</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-16">
          <div className="flex justify-center h-full w-full max-h-[500px]">
            {previewUrl && !imageUrl && <Image className="h-full" src={previewUrl} alt="Uploaded preview" width={400} height={400} />}
            {imageUrl && <img className="h-full" src={imageUrl} alt="URL preview" />}
          </div>
          <div className="flex justify-center h-full w-full max-h-[500px]">
            {processedImage && <img className="h-full" src={processedImage} alt="Processed preview" />}
          </div>
        </div>
      </div>
    </main>
  );
}
