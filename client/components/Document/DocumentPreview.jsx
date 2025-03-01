import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentPreview({ document }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">{document.title}</h3>
        <p className="text-sm text-gray-600">{document.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Type:</span>{" "}
            {document.fileType.toUpperCase()}
          </div>
          <div>
            <span className="font-medium">Size:</span> {document.fileSize}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => router.push(`/docs/${document.id}`)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View
        </Button>
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <a href={`${document.url}`} target="_blank" download>
            <Download className="h-4 w-4" /> Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
