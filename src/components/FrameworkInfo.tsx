
import React from "react";
import { Card } from "@/components/ui/card";

interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

interface FrameworkInfoProps {
  selectedFramework: string[];
  frameworks: Framework[];
}

const FrameworkInfo: React.FC<FrameworkInfoProps> = ({
  selectedFramework,
  frameworks
}) => {
  if (!selectedFramework || selectedFramework.length === 0 || frameworks.length === 0) {
    return null;
  }

  const selectedFrameworks = frameworks.filter(f => 
    selectedFramework.includes(f._id)
  );

  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-2">
        {selectedFrameworks.length > 1 
          ? "Selected Frameworks" 
          : "Selected Framework"}
      </h2>
      {selectedFrameworks.length > 0 ? (
        <div className="space-y-3">
          {selectedFrameworks.map(framework => (
            <div key={framework._id}>
              <p className="font-semibold">{framework.name}</p>
              {framework.description && (
                <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-red-500">Framework data not found!</p>
      )}
    </Card>
  );
};

export default FrameworkInfo;
