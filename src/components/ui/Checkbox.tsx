'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              'mt-1 h-4 w-4 rounded border-gray-300 text-purple-600',
              'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
              'dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          <div className="flex-1">
            <label htmlFor={checkboxId} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              {label}
            </label>
            {description && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'