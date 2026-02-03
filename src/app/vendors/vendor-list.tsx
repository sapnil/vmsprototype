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
import { MoreHorizontal, Eye, Pencil, Trash2, ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { mockVendors, type Vendor, type Site } from '@/lib/vendors';
import { cn } from '@/lib/utils';
import React, { Fragment, useState } from 'react';
import Link from 'next/link';

const statusColors = {
    Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

function SiteList({ sites }: { sites: Site[] }) {
    if (sites.length === 0) {
        return (
            <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
                This vendor has no registered sites.
            </div>
        )
    }
    return (
        <div className="p-4 bg-muted/50">
             <h4 className="font-semibold mb-2 px-4">Registered Sites</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Legal Name</TableHead>
                        <TableHead>GST Number</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sites.map((site) => (
                        <TableRow key={site.id}>
                            <TableCell className="font-medium">{site.legalName}</TableCell>
                            <TableCell>{site.gstNumber}</TableCell>
                            <TableCell>
                                <div>{site.contactPerson}</div>
                                <div className="text-sm text-muted-foreground">{site.contactEmail}</div>
                            </TableCell>
                            <TableCell>{site.dateAdded}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn(statusColors[site.status])}>
                                    {site.status}
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
                                        <DropdownMenuLabel>Site Actions</DropdownMenuLabel>
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
        </div>
    );
}

export function VendorList() {
    const vendors = mockVendors;
    const [openVendorId, setOpenVendorId] = useState<string | null>(null);

    const toggleVendor = (vendorId: string) => {
        setOpenVendorId(prev => (prev === vendorId ? null : vendorId));
    }

    // Automatically open the first vendor with multiple sites for demo purposes
    React.useEffect(() => {
        const firstMultiSiteVendor = vendors.find(v => v.sites.length > 1);
        if (firstMultiSiteVendor) {
            setOpenVendorId(firstMultiSiteVendor.id);
        }
    }, [vendors]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendor Overview</CardTitle>
                <CardDescription>
                    A list of all registered vendors. Click to expand and view their sites.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Vendor (Trade Name)</TableHead>
                            <TableHead>Sites</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <Fragment key={vendor.id}>
                                <TableRow onClick={() => toggleVendor(vendor.id)} className="cursor-pointer">
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="pointer-events-none">
                                            {openVendorId === vendor.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            <span className="sr-only">Toggle sites</span>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="font-bold">{vendor.tradeName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{vendor.sites.length}</Badge>
                                    </TableCell>
                                    <TableCell>{vendor.sites.length > 0 ? vendor.sites[0].dateAdded : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Link href={`/?vendorId=${vendor.id}`} passHref>
                                                <Button variant="outline" size="sm">
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Add New Site
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Vendor Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Vendor
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Vendor
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {openVendorId === vendor.id && (
                                     <TableRow>
                                        <TableCell colSpan={5} className="p-0 !border-0">
                                            <SiteList sites={vendor.sites} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
