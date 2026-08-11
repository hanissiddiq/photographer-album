"use client";

interface Props {
    status:
        | "draft"
        | "submitted"
        | "editing"
        | "printing"
        | "done";
}

const steps = [
    {
        key: "submitted",
        label: "Foto Sudah Dipilih",
        shortLabel: "Dipilih",
    },
    {
        key: "editing",
        label: "Progress Editing",
        shortLabel: "Editing",
    },
    {
        key: "printing",
        label: "Proses Cetak",
        shortLabel: "Cetak",
    },
    {
        key: "done",
        label: "DONE",
        shortLabel: "DONE",
    },
] as const;

export default function SelectionProgress({
    status,
}: Props) {
    const currentIndex =
        steps.findIndex(
            (step) => step.key === status
        );

    /*
    |--------------------------------------------------------------------------
    | draft
    |--------------------------------------------------------------------------
    */

    if (status === "draft") {
        return (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900">
                        Progress Foto
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Silakan pilih foto sesuai
                        dengan kuota yang diberikan.
                    </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-gray-400"
                        style={{
                            width: "0%",
                        }}
                    />
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Progress percentage
    |--------------------------------------------------------------------------
    */

    const progress =
        currentIndex <= 0
            ? 0
            : (currentIndex /
                  (steps.length - 1)) *
              100;

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <div className="mb-6">

                <p className="text-sm font-semibold text-gray-900">
                    Progress Album
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    {steps[currentIndex]?.label}
                </p>

            </div>

            <div className="relative">

                {/* Background line */}
                <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-gray-200" />

                {/* Progress line */}
                <div
                    className="absolute left-0 top-4 h-1 rounded-full bg-green-600 transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                />

                <div className="relative grid grid-cols-4">

                    {steps.map(
                        (step, index) => {

                            const completed =
                                index <=
                                currentIndex;

                            const active =
                                index ===
                                currentIndex;

                            return (
                                <div
                                    key={
                                        step.key
                                    }
                                    className="flex flex-col items-center"
                                >

                                    <div
                                        className={`
                                            flex h-8 w-8
                                            items-center justify-center
                                            rounded-full
                                            border-2
                                            text-xs
                                            font-bold
                                            transition-all
                                            ${
                                                completed
                                                    ? "border-green-600 bg-green-600 text-white"
                                                    : "border-gray-300 bg-white text-gray-400"
                                            }
                                            ${
                                                active
                                                    ? "ring-4 ring-green-100"
                                                    : ""
                                            }
                                        `}
                                    >
                                        {completed
                                            ? "✓"
                                            : index +
                                              1}
                                    </div>

                                    <p
                                        className={`
                                            mt-3
                                            text-center
                                            text-[11px]
                                            font-medium
                                            sm:text-xs
                                            ${
                                                active
                                                    ? "font-bold text-green-700"
                                                    : completed
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                            }
                                        `}
                                    >
                                        <span className="hidden sm:inline">
                                            {
                                                step.label
                                            }
                                        </span>

                                        <span className="sm:hidden">
                                            {
                                                step.shortLabel
                                            }
                                        </span>
                                    </p>

                                </div>
                            );
                        }
                    )}

                </div>
            </div>
        </div>
    );
}