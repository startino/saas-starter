create table "public"."environments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" text not null
);


alter table "public"."environments" enable row level security;

create table "public"."environments_profiles" (
    "environment_id" uuid not null default gen_random_uuid(),
    "profile_id" uuid not null default gen_random_uuid()
);


alter table "public"."environments_profiles" enable row level security;

CREATE UNIQUE INDEX environments_name_key ON public.environments USING btree (name);

CREATE UNIQUE INDEX environments_pkey ON public.environments USING btree (id);

CREATE UNIQUE INDEX environments_slug_key ON public.environments USING btree (slug);

alter table "public"."environments" add constraint "environments_pkey" PRIMARY KEY using index "environments_pkey";

alter table "public"."environments" add constraint "environments_name_key" UNIQUE using index "environments_name_key";

alter table "public"."environments" add constraint "environments_slug_key" UNIQUE using index "environments_slug_key";

alter table "public"."environments_profiles" add constraint "environments_profiles_environment_id_fkey" FOREIGN KEY (environment_id) REFERENCES environments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."environments_profiles" validate constraint "environments_profiles_environment_id_fkey";

alter table "public"."environments_profiles" add constraint "environments_profiles_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."environments_profiles" validate constraint "environments_profiles_profile_id_fkey";

grant delete on table "public"."environments" to "anon";

grant insert on table "public"."environments" to "anon";

grant references on table "public"."environments" to "anon";

grant select on table "public"."environments" to "anon";

grant trigger on table "public"."environments" to "anon";

grant truncate on table "public"."environments" to "anon";

grant update on table "public"."environments" to "anon";

grant delete on table "public"."environments" to "authenticated";

grant insert on table "public"."environments" to "authenticated";

grant references on table "public"."environments" to "authenticated";

grant select on table "public"."environments" to "authenticated";

grant trigger on table "public"."environments" to "authenticated";

grant truncate on table "public"."environments" to "authenticated";

grant update on table "public"."environments" to "authenticated";

grant delete on table "public"."environments" to "service_role";

grant insert on table "public"."environments" to "service_role";

grant references on table "public"."environments" to "service_role";

grant select on table "public"."environments" to "service_role";

grant trigger on table "public"."environments" to "service_role";

grant truncate on table "public"."environments" to "service_role";

grant update on table "public"."environments" to "service_role";

grant delete on table "public"."environments_profiles" to "anon";

grant insert on table "public"."environments_profiles" to "anon";

grant references on table "public"."environments_profiles" to "anon";

grant select on table "public"."environments_profiles" to "anon";

grant trigger on table "public"."environments_profiles" to "anon";

grant truncate on table "public"."environments_profiles" to "anon";

grant update on table "public"."environments_profiles" to "anon";

grant delete on table "public"."environments_profiles" to "authenticated";

grant insert on table "public"."environments_profiles" to "authenticated";

grant references on table "public"."environments_profiles" to "authenticated";

grant select on table "public"."environments_profiles" to "authenticated";

grant trigger on table "public"."environments_profiles" to "authenticated";

grant truncate on table "public"."environments_profiles" to "authenticated";

grant update on table "public"."environments_profiles" to "authenticated";

grant delete on table "public"."environments_profiles" to "service_role";

grant insert on table "public"."environments_profiles" to "service_role";

grant references on table "public"."environments_profiles" to "service_role";

grant select on table "public"."environments_profiles" to "service_role";

grant trigger on table "public"."environments_profiles" to "service_role";

grant truncate on table "public"."environments_profiles" to "service_role";

grant update on table "public"."environments_profiles" to "service_role";

create policy "Enable insert for authenticated users"
on "public"."environments"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."environments"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."environments_profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."environments_profiles"
as permissive
for select
to authenticated
using (true);



