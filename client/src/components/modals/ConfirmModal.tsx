import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";

type ConfirmModalProps = {
    isOpen: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
};

export const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onConfirm,
    onCancel,
    confirmText = "Yes",
    cancelText = "No",
}: ConfirmModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};