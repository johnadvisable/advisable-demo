-- Remove all existing testimonials
UPDATE clients_translations SET testimonial = NULL;

-- Remove the testimonial column entirely to prevent future use
ALTER TABLE clients_translations DROP COLUMN testimonial;