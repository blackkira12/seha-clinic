import PageHeader from "@/components/PageHeader";
import { accessMatrix } from "@/data/access";

// Soft colour accent per role name.
function roleAccent(role: string): string {
  switch (role) {
    case "Admin":
      return "text-brand-700";
    case "Dokter":
      return "text-safe-text";
    case "Perawat":
      return "text-warn-text";
    case "Apoteker":
      return "text-danger-text";
    case "Developer":
      return "text-gray-800";
    default:
      return "text-gray-700";
  }
}

export default function AccessControlPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hak Akses (Role-Based Access)"
        description="Ringkasan akses tiap peran terhadap modul sistem klinik."
      />

      <p className="card text-sm text-gray-600">
        Catatan: ini adalah <span className="font-medium">simulasi role-switcher</span>,
        bukan autentikasi atau otorisasi sungguhan. Peran dapat diganti dari header tanpa
        proses login. Peran <span className="font-medium">Developer</span> ditampilkan
        sebagai akses tertinggi hanya sebagai gambaran konseptual — tidak ada backend nyata
        yang menegakkan aturan ini pada prototype.
      </p>

      <section className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Akses Lihat</th>
              <th className="px-4 py-3 font-semibold">Akses Edit</th>
              <th className="px-4 py-3 font-semibold">Akses Dibatasi</th>
            </tr>
          </thead>
          <tbody>
            {accessMatrix.map((row) => (
              <tr
                key={row.role}
                className="border-b border-gray-50 align-top last:border-b-0 hover:bg-brand-50/40"
              >
                <td className={`px-4 py-3 font-semibold ${roleAccent(row.role)}`}>
                  {row.role}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.viewAccess}</td>
                <td className="px-4 py-3 text-gray-600">{row.editAccess}</td>
                <td className="px-4 py-3 text-gray-500">{row.restricted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
