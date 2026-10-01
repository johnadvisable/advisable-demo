import LanguageSelector from '@/components/LanguageSelector';

interface HeaderActionsProps {
  variant?: 'dark' | 'light';
  isScrolled?: boolean;
}

const HeaderActions = ({ variant = 'dark', isScrolled = false }: HeaderActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <LanguageSelector variant={variant} isScrolled={isScrolled} />
    </div>
  );
};

export default HeaderActions;
