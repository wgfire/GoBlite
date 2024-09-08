import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceType = "online" | "development";

interface ServiceData {
  type: ServiceType;
  address: string;
  token?: string;
}

interface ExportServiceProps {
  onServiceDataChange: (data: ServiceData) => void;
}

export const ExportService = ({ onServiceDataChange }: ExportServiceProps) => {
  const [activeTab, setActiveTab] = useState<ServiceType>("online");
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onServiceDataChange({
      type: activeTab,
      address,
      ...(activeTab === "online" && { token }),
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceType)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="online">线上服务</TabsTrigger>
        <TabsTrigger value="development">开发服务</TabsTrigger>
      </TabsList>
      <TabsContent value="online">
        <Card>
          <CardHeader>
            <CardTitle>线上服务配置</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="online-address">服务地址</Label>
                <Input id="online-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="请输入线上服务地址" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="token">Token</Label>
                <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="请输入Token" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">保存</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="development">
        <Card>
          <CardHeader>
            <CardTitle>开发服务配置</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="dev-address">服务地址</Label>
                <Input id="dev-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="请输入开发服务地址" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">保存</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
