import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FileText, FileSpreadsheet, File, FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DocumentCard({
  document,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const getDocumentIcon = () => {
    switch (document.fileType) {
      case "pdf":
        return <File className="h-8 w-8 text-red-500" />;
      case "docx":
        return <FileTextIcon className="h-8 w-8 text-blue-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <Card
      className="h-full transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {getDocumentIcon()}
        <Badge variant="secondary">{document.category}</Badge>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {document.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {document.description}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-gray-400">
        Last updated: {new Date(document.lastUpdated).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
