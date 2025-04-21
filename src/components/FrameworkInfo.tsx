
import React from "react";
import { Card } from "@/components/ui/card";

interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

interface FrameworkInfoProps {
  selectedFramework: string;
  frameworks: Framework[];
}

const FrameworkInfo: React.FC<FrameworkInfoProps> = ({
  selectedFramework,
  frameworks
}) => {
  if (!selectedFramework || frameworks.length === 0) {
    return null;
  }

  const framework = frameworks.find(f => f._id === selectedFramework);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-2">Selected Framework</h2>
      {framework ? (
        <div>
          <p className="font-semibold">{framework.name}</p>
          {framework.description && (
            <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-red-500">Framework data not found!</p>
      )}
    </Card>
  );
};

export default FrameworkInfo;
