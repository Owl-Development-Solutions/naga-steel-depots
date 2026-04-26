"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createUpdateReview,
  getReviewByProductId,
} from "@/lib/actions/review-actions";
import { reviewFormDefaultValues } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { insertReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
  hasReview,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted?: () => void;
  hasReview?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema as any),
    defaultValues: reviewFormDefaultValues,
  });

  const handleOpenForm = async () => {
    form.setValue("productId", productId);
    form.setValue("userId", userId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
    }

    setOpen(true);
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values,
  ) => {
    const res = await createUpdateReview({
      ...values,
      productId,
    });

    if (!res.success) {
      return toast.warning(res.message);
    }

    setOpen(false);

    onReviewSubmitted!();

    toast.success(res.message);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  console.log(hasReview);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default" className="mt-3">
        {hasReview ? "Update review" : "Write a Review"}
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <form method="post" onSubmit={form.handleSubmit(onSubmit, onError)}>
          <DialogHeader>
            <DialogTitle>
              {" "}
              {hasReview ? "Update review" : "Write a Review"}
            </DialogTitle>
            <DialogDescription>
              Share your thoughts with other customers
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof insertReviewSchema>,
                    "title"
                  >;
                  fieldState: ControllerFieldState;
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      placeholder="Enter title"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof insertReviewSchema>,
                    "description"
                  >;
                  fieldState: ControllerFieldState;
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="rating"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof insertReviewSchema>,
                    "rating"
                  >;
                  fieldState: ControllerFieldState;
                }) => (
                  <Field>
                    <FieldLabel>Rating</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                      name={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        id="form-rhf-select-language"
                      >
                        <SelectValue placeholder="Select a rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <SelectItem key={idx} value={(idx + 1).toString()}>
                            {idx + 1} <StarIcon className="inline w-4 h-4" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
