<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}" lang="${locale.currentLanguageTag}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body class="${properties.kcBodyClass!}">
    <div class="${properties.kcContainerClass!}">
        <div class="${properties.kcContentWrapperClass!}">
            <div class="${properties.kcHeaderClass!}">
                <#if realm.internationalizationEnabled && locale.supported?size gt 1>
                    <div class="language-picker">
                        <div class="kc-dropdown" id="kc-locale-dropdown">
                            <a href="#" id="kc-current-locale-link">${locale.current}</a>
                            <ul>
                                <#list locale.supported as l>
                                    <li class="kc-dropdown-item">
                                        <a href="${l.url}">${l.label}</a>
                                    </li>
                                </#list>
                            </ul>
                        </div>
                    </div>
                </#if>
                <#if !(url.logoutUrl?has_content)>
                    <div class="logo-container">
                        <img src="${url.resourcesPath}/img/botmaster-logo.svg" alt="BotMaster Logo" class="${properties.kcLogoClass!}">
                    </div>
                    <h1>${msg("loginTitleHtml",(realm.displayNameHtml!''))}</h1>
                </#if>
            </div>

            <div class="${properties.kcFormCardClass!}">
                <header class="${properties.kcFormHeaderClass!}">
                    <#if realm.displayNameHtml?? && realm.displayNameHtml != ''>
                        ${realm.displayNameHtml?no_esc}
                    <#elseif realm.displayName?? && realm.displayName != ''>
                        ${realm.displayName}
                    <#else>
                        ${msg("loginTitle",(realm.displayName!''))}
                    </#if>
                </header>
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        <#-- App-initiated actions should not see warning messages about the need to complete the action -->
                        <#-- during login.                                                                               -->
                        <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                            <div class="alert alert-${message.type}">
                                <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                                <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                                <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                                <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                                <span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span>
                            </div>
                        </#if>

                        <#nested "form">

                        <#if displayInfo>
                            <#nested "info">
                        </#if>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
</#macro>

