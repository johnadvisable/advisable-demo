UPDATE public.service_translations st
SET title = 'Kubernetes Experts - Consulting & DevOps Services'
FROM public.services s
WHERE st.service_id = s.id
  AND s.slug = 'cloud-infrastructure-k8s';