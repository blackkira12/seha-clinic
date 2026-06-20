import Link from "next/link";
import { ReactNode } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Patient } from "@/data/types";

interface PatientCardProps {
  patient: Patient;
  href?: string;
}

// Heuristic: treat "Tidak ada alergi..." as no-allergy, anything else as an allergy.
function hasAllergy(allergyNotes: string): boolean {
  return !/tidak ada alergi/i.test(allergyNotes.trim());
}

function CardBody({ patient }: { patient: Patient }) {
  const allergic = hasAllergy(patient.allergyNotes);
  return (
    <div className="card h-full transition hover:border-brand-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-800">{patient.name}</p>
          <p className="text-xs text-gray-400">{patient.id}</p>
        </div>
        {allergic ? (
          <StatusBadge tone="danger">Alergi</StatusBadge>
        ) : (
          <StatusBadge tone="safe">Tidak ada alergi</StatusBadge>
        )}
      </div>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-400">Usia</dt>
          <dd className="text-right text-gray-700">{patient.ageLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-400">Jenis Kelamin</dt>
          <dd className="text-right text-gray-700">
            {patient.gender === "L" ? "Laki-laki" : "Perempuan"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-400">Orang Tua</dt>
          <dd className="truncate text-right text-gray-700">{patient.parentName}</dd>
        </div>
      </dl>

      {allergic && (
        <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-xs text-danger-text">
          {patient.allergyNotes}
        </p>
      )}
    </div>
  );
}

export default function PatientCard({ patient, href }: PatientCardProps): ReactNode {
  if (href) {
    return (
      <Link href={href} className="block">
        <CardBody patient={patient} />
      </Link>
    );
  }
  return <CardBody patient={patient} />;
}
