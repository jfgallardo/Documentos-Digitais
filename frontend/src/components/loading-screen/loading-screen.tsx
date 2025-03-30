import { IconSignature } from "@tabler/icons-react";

// ----------------------------------------------------------------------

type Props = {
  text: string;
};

export default function LoadingScreen({ text }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <IconSignature className="w-14 h-14 text-blue-600 animate-bounce" />

        <p className="text-lg font-medium text-gray-600">{text}</p>
      </div>
    </div>
  );
}
