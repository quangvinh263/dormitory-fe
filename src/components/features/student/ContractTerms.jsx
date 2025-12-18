import Section from '../../shared/Section';

export default function ContractTerms({ terms }) {
  return (
    <Section className="animate-fade-in-up delay-100">
      <h3 className="font-bold text-gray-900 mb-4">Điều khoản hợp đồng:</h3>
      <ul className="space-y-3">
        {terms.map((term, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 block"></span>
            <span>{term}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}