import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ChangePasswordAlert() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-md">Change Password</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change password</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>Change your password here. After saving, you'll be logged out.</div>
                        <div className="pt-8 pb-4 space-y-1.5">
                            <div className="space-y-1">
                                <Label htmlFor="current" className="text-primary">Current password</Label>
                                <Input id="current" type="password" className="bg-primary-foreground" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new" className="text-primary">New password</Label>
                                <Input id="new" type="password" className="bg-primary-foreground" />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Change</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
