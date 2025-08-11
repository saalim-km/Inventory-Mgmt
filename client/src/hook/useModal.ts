import { useState } from "react";

export const useConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
    const [title, setTitle] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();

    const openModal = ({
        onConfirm,
        title,
        description,
    }: {
        onConfirm: () => void;
        title?: string;
        description?: string;
    }) => {
        setOnConfirm(() => onConfirm);
        setTitle(title);
        setDescription(description);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    return {
        isOpen,
        title,
        description,
        onConfirm,
        openModal,
        closeModal,
    };
};