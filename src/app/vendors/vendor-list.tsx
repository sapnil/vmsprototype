'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { mockVendors, type Vendor } from '@/lib/vendors';
import { cn } from '@/lib/utils';

const statusColors = {
    Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

export function VendorList() {
    const vendors = mockVendors;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendor Overview</CardTitle>
                <CardDescription>
                    A list of all registered vendors and their current status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell className="font-medium">
                                    <div className="font-bold">{vendor.tradeName}</div>
                                    <div className="text-sm text-muted-foreground">{vendor.legalName}</div>
                                </TableCell>
                                <TableCell>
                                    <div>{vendor.contactPerson}</div>
                                    <div className="text-sm text-muted-foreground">{vendor.contactEmail}</div>
                                </TableCell>
                                <TableCell>{vendor.dateAdded}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn(statusColors[vendor.status])}>
                                        {vendor.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
