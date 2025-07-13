CREATE OR REPLACE FUNCTION set_session_context(
    folder_key UUID,
    tenant_key UUID,
    organization TEXT
) RETURNS void AS $$
BEGIN
    PERFORM set_config('app.folder_key', folder_key::TEXT, false);
    PERFORM set_config('app.tenant_key', tenant_key::TEXT, false);
    PERFORM set_config('app.organization', organization::TEXT, false);
END;
$$ LANGUAGE plpgsql;
