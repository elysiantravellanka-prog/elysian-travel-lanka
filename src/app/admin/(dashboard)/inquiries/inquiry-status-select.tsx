'use client';

import { useTransition } from 'react';

interface InquiryStatusSelectProps {
  defaultValue: string;
}

export function InquiryStatusSelect({ defaultValue }: InquiryStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // We need to request the form submission directly from the event target
    // since this input is inside a form in the parent Server Component.
    // However, the `action` prop on the form expects the FormData.
    // Since we are inside a form controlled by a Server Action in the parent,
    // and we want to trigger that action on change...
    
    // Actually, the original code used `e.target.form?.requestSubmit()`.
    // This works if the input is inside the <form> element.
    // The parent `page.tsx` has:
    // <form action={handleStatusChange}>
    //    <input type="hidden" name="id" value={...} />
    //    <select ... onChange={(e) => e.target.form?.requestSubmit()} ...>
    // </form>
    // So if we render this component inside that form, `e.target.form` will refer to the parent form.
    
    event.target.form?.requestSubmit();
  };

  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={handleChange}
      disabled={isPending}
      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#c9a962] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="New" className="bg-[#0a1628]">New</option>
      <option value="Contacted" className="bg-[#0a1628]">Contacted</option>
      <option value="Closed" className="bg-[#0a1628]">Closed</option>
    </select>
  );
}
