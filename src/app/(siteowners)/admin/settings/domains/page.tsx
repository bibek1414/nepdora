import React from "react";
import { getServerUser } from "@/hooks/use-jwt-server"; // Adjust the import path as needed
import { siteConfig } from "@/config/site"; // Adjust the import path as needed

interface DomainTableProps {
  domain: string;
  storeName: string;
  phoneNumber: string;
  email: string;
}

const DomainTable: React.FC<DomainTableProps> = ({
  domain,
  storeName,
  phoneNumber,
  email,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                {domain}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {storeName}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {phoneNumber}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {email}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

async function DomainsPage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="text-gray-600">Please log in to view your domains.</p>
        </div>
      </div>
    );
  }

  // Generate the appropriate domain based on environment
  const generateDomain = (subDomain: string): string => {
    if (siteConfig.isDev) {
      return `${subDomain}.localhost:${siteConfig.frontendDevPort}`;
    } else {
      return `${subDomain}.${siteConfig.baseDomain}`;
    }
  };

  const fullDomain = generateDomain(user.subDomain);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8"></div>

        <DomainTable
          domain={fullDomain}
          storeName={user.storeName}
          phoneNumber={user.phoneNumber}
          email={user.email}
        />
      </div>
    </div>
  );
}

export default DomainsPage;
