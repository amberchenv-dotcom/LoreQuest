/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  // Resolve icon safely. Fallback to HelpCircle if not found.
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];

  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  // Fallback icon
  return <Icons.HelpCircle className={className} size={size} />;
}
