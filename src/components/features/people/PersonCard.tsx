'use client';

import { Avatar, Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

interface PersonCardProps {
  id: string;
  name: string;
  position: string;
  role: 'actor' | 'staff';
  photoUrl: string | null;
}

export function PersonCard({ id, name, position, role, photoUrl }: PersonCardProps) {
  return (
    <Link href={`/people/${id}`}>
      <div className="group rounded-2xl border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg">
        <div className="mb-4 flex justify-center">
          <Avatar
            src={photoUrl || undefined}
            name={name}
            size="xl"
            shape="circle"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{position}</p>
          <div className="mt-3">
            <Badge
              variant="subtle"
              color={role === 'actor' ? 'primary' : 'success'}
              size="sm"
            >
              {role === 'actor' ? '배우' : '스텝'}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
