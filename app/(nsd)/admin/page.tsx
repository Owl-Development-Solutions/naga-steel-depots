"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const statsCards = [
  {
    title: "Total Revenue",
    value: "₱2,456,890",
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    changeType: "increase",
    icon: ShoppingCart,
    description: "from last month",
  },
  {
    title: "Total Products",
    value: "456",
    change: "+3.1%",
    changeType: "increase",
    icon: Package,
    description: "from last month",
  },
  {
    title: "Active Users",
    value: "8,901",
    change: "-2.4%",
    changeType: "decrease",
    icon: Users,
    description: "from last month",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Dela Cruz",
    product: "Carbon Steel Sheet",
    amount: "₱45,000",
    status: "completed",
    date: "2024-04-18",
  },
  {
    id: "ORD-002",
    customer: "Maria Santos",
    product: "Stainless Steel Pipe",
    amount: "₱32,500",
    status: "processing",
    date: "2024-04-18",
  },
  {
    id: "ORD-003",
    customer: "Jose Reyes",
    product: "Steel Wire",
    amount: "₱18,750",
    status: "pending",
    date: "2024-04-17",
  },
  {
    id: "ORD-004",
    customer: "Ana Garcia",
    product: "Carbon Steel Rod",
    amount: "₱28,900",
    status: "completed",
    date: "2024-04-17",
  },
]

const topProducts = [
  {
    name: "Carbon Steel Sheet",
    sales: 234,
    revenue: "₱1,234,500",
    trend: "up",
  },
  {
    name: "Stainless Steel Pipe",
    sales: 189,
    revenue: "₱987,600",
    trend: "up",
  },
  {
    name: "Steel Wire",
    sales: 156,
    revenue: "₱654,300",
    trend: "down",
  },
  {
    name: "Carbon Steel Rod",
    sales: 123,
    revenue: "₱543,200",
    trend: "up",
  },
]

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your business.
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/products/new">
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <div className={`flex items-center ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </CardContent>
            <div className={`absolute top-0 right-0 h-16 w-16 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${
              stat.changeType === 'increase' ? 'from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10' : 'from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10'
            }`} />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders and their status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' : 
                        order.status === 'processing' ? 'secondary' : 'outline'
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <div className={`flex items-center justify-end ${
                      product.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      <span className="text-xs">
                        {product.trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 20 + 5)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link href="/admin/products/new">
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                <span>View Orders</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/users">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/reports">
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
