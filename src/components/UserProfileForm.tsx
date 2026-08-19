import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Ruler,
  Weight,
  Activity,
  Dumbbell,
  ChevronDown,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserProfile, type UserProfile } from "@/context/UserProfileContext";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int("Age must be a whole number")
    .min(10, "Age must be at least 10")
    .max(120, "Age must be 120 or below"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),
  heightCm: z
    .number({ invalid_type_error: "Height is required" })
    .min(50, "Height must be at least 50 cm")
    .max(280, "Height must be 280 cm or below"),
  weightKg: z
    .number({ invalid_type_error: "Weight is required" })
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be 500 kg or below"),
  activityLevel: z.enum(
    ["sedentary", "lightly-active", "moderately-active", "very-active"],
    { required_error: "Please select an activity level" },
  ),
  fitnessExperience: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your fitness experience",
  }),
});

type FormValues = z.infer<typeof schema>;

// ─── Option configs ─────────────────────────────────────────────────────────
const activityOptions = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "lightly-active", label: "Lightly Active", desc: "1–3 days/week" },
  { value: "moderately-active", label: "Moderately Active", desc: "3–5 days/week" },
  { value: "very-active", label: "Very Active", desc: "6–7 days/week" },
] as const;

const experienceOptions = [
  { value: "beginner", label: "Beginner", desc: "Less than 1 year" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 years" },
  { value: "advanced", label: "Advanced", desc: "3+ years" },
] as const;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

// ─── Sub-components ─────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>;
}

function FieldLabel({
  icon: Icon,
  label,
  required,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
      <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-3.5" />
      </span>
      {label}
      {required && <span className="text-destructive">*</span>}
    </label>
  );
}

// ─── Main form ───────────────────────────────────────────────────────────────
interface UserProfileFormProps {
  onComplete?: (profile: UserProfile) => void;
}

export function UserProfileForm({ onComplete }: UserProfileFormProps) {
  const { setProfile } = useUserProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const watchedActivity = watch("activityLevel");
  const watchedExperience = watch("fitnessExperience");

  function onSubmit(data: FormValues) {
    const profile: UserProfile = {
      age: data.age,
      gender: data.gender,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activityLevel: data.activityLevel,
      fitnessExperience: data.fitnessExperience,
    };
    setProfile(profile);
    onComplete?.(profile);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Row: Age + Gender */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Age */}
        <div>
          <FieldLabel icon={CalendarDays} label="Age" required />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            placeholder="e.g. 28"
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
              "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
              errors.age ? "border-destructive focus:ring-destructive/20" : "border-border",
            )}
            {...register("age", {
              setValueAs: (v: string) => (v === "" ? NaN : parseInt(v, 10)),
            })}
          />
          <FieldError message={errors.age?.message} />
        </div>

        {/* Gender */}
        <div>
          <FieldLabel icon={User} label="Gender" required />
          <div className="relative">
            <select
              className={cn(
                "w-full appearance-none rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                errors.gender ? "border-destructive focus:ring-destructive/20" : "border-border",
              )}
              defaultValue=""
              {...register("gender")}
            >
              <option value="" disabled>
                Select gender
              </option>
              {genderOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <FieldError message={errors.gender?.message} />
        </div>
      </div>

      {/* Row: Height + Weight */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Height */}
        <div>
          <FieldLabel icon={Ruler} label="Height (cm)" required />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            placeholder="e.g. 175"
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
              "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
              errors.heightCm ? "border-destructive focus:ring-destructive/20" : "border-border",
            )}
            {...register("heightCm", {
              setValueAs: (v: string) => (v === "" ? NaN : parseFloat(v)),
            })}
          />
          <FieldError message={errors.heightCm?.message} />
        </div>

        {/* Weight */}
        <div>
          <FieldLabel icon={Weight} label="Weight (kg)" required />
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            maxLength={6}
            placeholder="e.g. 70"
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors",
              "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
              errors.weightKg ? "border-destructive focus:ring-destructive/20" : "border-border",
            )}
            {...register("weightKg", {
              setValueAs: (v: string) => (v === "" ? NaN : parseFloat(v)),
            })}
          />
          <FieldError message={errors.weightKg?.message} />
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <FieldLabel icon={Activity} label="Activity Level" required />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {activityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("activityLevel", opt.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5",
                watchedActivity === opt.value
                  ? "border-primary bg-primary/8 shadow-soft"
                  : "border-border bg-background hover:border-primary/40 hover:bg-secondary/60",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium leading-snug",
                  watchedActivity === opt.value ? "text-primary" : "text-foreground",
                )}
              >
                {opt.label}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
        {/* hidden input to register field */}
        <input type="hidden" {...register("activityLevel")} />
        <FieldError message={errors.activityLevel?.message} />
      </div>

      {/* Fitness Experience */}
      <div>
        <FieldLabel icon={Dumbbell} label="Fitness Experience" required />
        <div className="grid grid-cols-3 gap-2">
          {experienceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("fitnessExperience", opt.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5",
                watchedExperience === opt.value
                  ? "border-primary bg-primary/8 shadow-soft"
                  : "border-border bg-background hover:border-primary/40 hover:bg-secondary/60",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  watchedExperience === opt.value ? "text-primary" : "text-foreground",
                )}
              >
                {opt.label}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register("fitnessExperience")} />
        <FieldError message={errors.fitnessExperience?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" variant="hero" size="lg" className="w-full">
        Continue <ArrowRight />
      </Button>
    </form>
  );
}
