import React from 'react';
import {Paper} from '@mui/material';
import {PageContent} from '@control-ui/kit/PageContent';
import {HeadMeta} from '@control-ui/kit/HeadMeta';

const DocsHandler = ({children}) => {
    return <>
        <HeadMeta title={'UI-Schema'}/>
        <PageContent>
            <Paper elevation={4} style={{margin: 12, padding: 24}}>
                {children}
            </Paper>
        </PageContent>
    </>;
};

const PageImpress = () => <DocsHandler>
    <h1>Site Notice</h1>

    <h2>Information pursuant to Sect. 5 German Telemedia Act (TMG)</h2>
    <p>bemit UG (haftungsbeschränkt)<br/>
        Langgasse 29<br/>
        55283 Nierstein</p>

    <p>Commercial Register: 47413<br/>
        Registration court: Mainz</p>

    <p><strong>Represented by:</strong><br/>
        Michael Becker</p>

    <h2>Contact</h2>
    <p>Phone: +49 151 624 123 75<br/>
        E-mail: info@bemit.eu</p>

    <h2>VAT ID</h2>
    <p>Sales tax identification number according to Sect. 27 a of the Sales Tax Law:<br/>
        DE312020006</p>

    <h2>EU dispute resolution</h2>
    <p>The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.<br/> Our e-mail address can be found above in the site notice.
    </p>

    <h2>Dispute resolution proceedings in front of a consumer arbitration board</h2><p>We are not willing or obliged to participate in dispute resolution proceedings in front of a consumer arbitration board.</p>

    <h3>Liability for Contents</h3>
    <p>As service providers, we are liable for own contents of these websites according to Paragraph 7, Sect. 1 German Telemedia Act (TMG). However, according to Paragraphs 8 to 10 German Telemedia Act (TMG), service providers are not obligated to permanently monitor submitted or stored information or to search for evidences that indicate illegal activities.</p>
    <p>Legal obligations to removing information or to blocking the use of information remain unchallenged. In this case, liability is only possible at the time of knowledge about a specific violation of law. Illegal contents will be removed immediately at the time we get knowledge of them.</p>
    <h3>Liability for Links</h3>
    <p>Our offer includes links to external third party websites. We have no influence on the contents of those websites, therefore we cannot guarantee for those contents. Providers or administrators of linked websites are always responsible for their own contents.</p>
    <p>The linked websites had been checked for possible violations of law at the time of the establishment of the link. Illegal contents were not detected at the time of the linking. A permanent monitoring of the contents of linked websites cannot be imposed without reasonable indications that there has been a violation of law. Illegal links will be removed immediately at the time we get knowledge of them.</p>
    <h3>Copyright</h3>
    <p>Contents and compilations published on these websites by the providers are subject to German copyright laws. Reproduction, editing, distribution as well as the use of any kind outside the scope of the copyright law require a written permission of the author or originator. Downloads and copies of these websites are permitted for private use only.<br/> The commercial use of our contents without permission of the originator is prohibited.
    </p>
    <p>Copyright laws of third parties are respected as long as the contents on these websites do not originate from the provider. Contributions of third parties on this site are indicated as such. However, if you notice any violations of copyright law, please inform us. Such contents will be removed immediately.</p>
</DocsHandler>;
const PagePrivacy = () => <DocsHandler>
    <h1>Privacy Policy</h1>
    <h2>1. An overview of data protection</h2>
    <h3>General information</h3>
    <p>The following information will provide you with an easy to navigate overview of what will happen with your personal data when you visit our website. The term “personal data” comprises all data that can be used to personally identify you. For detailed information about the subject matter of data protection, please consult our Data Protection Declaration, which we have included beneath this copy.</p>
    <h3>Data recording on our website</h3> <p><strong>Who is the responsible party for the recording of data on this website (i.e. the “controller”)?</strong></p>
    <p>The data on this website is processed by the operator of the website, whose contact information is available under section “Information Required by Law” on this website.</p> <p><strong>How do we record your data?</strong></p>
    <p>We collect your data as a result of your sharing of your data with us. This may, for instance be information you enter into our contact form.</p>
    <p>Our IT systems automatically record other data when you visit our website. This data comprises primarily technical information (e.g. web browser, operating system or time the site was accessed). This information is recorded automatically when you access our website.</p>
    <p><strong>What are the purposes we use your data for?</strong></p> <p>A portion of the information is generated to guarantee the error free provision of the website. Other data may be used to analyse your user patterns.</p> <p>
    <strong>What rights do you have as far as your information is concerned?</strong></p>
    <p>You have the right to receive information about the source, recipients and purposes of your archived personal data at any time without having to pay a fee for such disclosures. You also have the right to demand that your data are rectified, blocked or eradicated. Please do not hesitate to contact us at any time under the address disclosed in section “Information Required by Law” on this website if you have questions about this or any other data protection related issues. You also have the right to log a complaint with the competent supervising agency.</p>
    <p>Moreover, under certain circumstances, you have the right to demand the restriction of the processing of your personal data. For details, please consult the Data Protection Declaration under section “Right to Restriction of Data Processing.”</p>
    <h2>2. General information and mandatory information</h2>
    <h3>Data protection</h3>
    <p>The operators of this website and its pages take the protection of your personal data very seriously. Hence, we handle your personal data as confidential information and in compliance with the statutory data protection regulations and this Data Protection Declaration.</p>
    <p>Whenever you use this website, a variety of personal information will be collected. Personal data comprises data that can be used to personally identify you. This Data Protection Declaration explains which data we collect as well as the purposes we use this data for. It also explains how, and for which purpose the information is collected.</p>
    <p>We herewith advise you that the transmission of data via the Internet (i.e. through e-mail communications) may be prone to security gaps. It is not possible to completely protect data against third party access.</p>
    <h3>Information about the responsible party (referred to as the “controller” in the GDPR)</h3> <p>The data processing controller on this website is:</p> <p>bemit UG (haftungsbeschränkt)</p>

    <p>Phone: +49 151 624 123 75<br/>
        E-mail: info@bemit.eu</p>
    <p>The controller is the natural person or legal entity that single-handedly or jointly with others makes decisions as to the purposes of and resources for the processing of personal data (e.g. names, e-mail addresses, etc.).</p>
    <h3>Designation of a data protection officer as mandated by law</h3> <p>We have appointed a data protection officer for our company.</p>
    <p>Michael Becker<br/>
        Langgasse 29<br/>
        55283 Nierstein</p>

    <p>Phone: +49 151 624 123 75<br/>
        E-mail: privacy@bemit.eu</p>
    <h3>Revocation of your consent to the processing of data</h3>
    <p>A wide range of data processing transactions are possible only subject to your express consent. You can also revoke at any time any consent you have already given us. To do so, all you are required to do is sent us an informal notification via e-mail. This shall be without prejudice to the lawfulness of any data collection that occurred prior to your revocation.</p>
    <h3>Right to object to the collection of data in special cases; right to object to direct advertising (Art. 21 GDPR)</h3> <p>
    <strong>In the event that data are processed on the basis of Art. 6 Sect. 1 lit. e or f GDPR, you have the right to at any time object to the processing of your personal data based on grounds arising from your unique situation. This also applies to any profiling based on these provisions. To determine the legal basis, on which any processing of data is based, please consult this Data Protection Declaration. If you log an objection, we will no longer process your affected personal data, unless we are in a position to present compelling protection worthy grounds for the processing of your data, that outweigh your interests, rights and freedoms or if the purpose of the processing is the claiming, exercising or defence of legal entitlements (objection pursuant to Art. 21 Sect. 1 GDPR).</strong>
</p> <p>
    <strong>If your personal data is being processed in order to engage in direct advertising, you have the right to at any time object to the processing of your affected personal data for the purposes of such advertising. This also applies to profiling to the extent that it is affiliated with such direct advertising. If you object, your personal data will subsequently no longer be used for direct advertising purposes (objection pursuant to Art. 21 Sect. 2 GDPR).</strong>
</p>
    <h3>Right to log a complaint with the competent supervisory agency</h3>
    <p>In the event of violations of the GDPR, data subjects are entitled to log a complaint with a supervisory agency, in particular in the member state where they usually maintain their domicile, place of work or at the place where the alleged violation occurred. The right to log a complaint is in effect regardless of any other administrative or court proceedings available as legal recourses.</p>
    <h3>Right to data portability</h3>
    <p>You have the right to demand that we hand over any data we automatically process on the basis of your consent or in order to fulfil a contract be handed over to you or a third party in a commonly used, machine readable format. If you should demand the direct transfer of the data to another controller, this will be done only if it is technically feasible.</p>
    <h3>SSL and/or TLS encryption</h3>
    <p>For security reasons and to protect the transmission of confidential content, such as purchase orders or inquiries you submit to us as the website operator, this website uses either an SSL or a TLS encryption programme. You can recognise an encrypted connection by checking whether the address line of the browser switches from “http://” to “https://” and also by the appearance of the lock icon in the browser line.</p>
    <p>If the SSL or TLS encryption is activated, data you transmit to us cannot be read by third parties.</p>
    <h3>Information about, blockage, rectification and eradication of data</h3>
    <p>Within the scope of the applicable statutory provisions, you have the right to at any time demand information about your archived personal data, their source and recipients as well as the purpose of the processing of your data. You may also have a right to have your data rectified, blocked or eradicated. If you have questions about this subject matter or any other questions about personal data, please do not hesitate to contact us at any time at the address provided in section “Information Required by Law.”</p>
    <h3>Right to demand processing restrictions</h3>
    <p>You have the right to demand the imposition of restrictions as far as the processing of your personal data is concerned. To do so, you may contact us at any time at the address provided in section “Information Required by Law.” The right to demand restriction of processing applies in the following cases:</p>
    <ul>
        <li>In the event that you should dispute the correctness of your data archived by us, we will usually need some time to verify this claim. During the time that this investigation is ongoing, you have the right to demand that we restrict the processing of your personal data.</li>
        <li>If the processing of your personal data was/is conducted in an unlawful manner, you have the option to demand the restriction of the processing of your data in lieu of demanding the eradication of this data.</li>
        <li>If we do not need your personal data any longer and you need it to exercise, defend or claim legal entitlements, you have the right to demand the restriction of the processing of your personal data instead of its eradication.</li>
        <li>If you have raised an objection pursuant to Art. 21 Sect. 1 GDPR, your rights and our rights will have to be weighed against each other. As long as it has not been determined whose interests prevail, you have the right to demand a restriction of the processing of your personal data.</li>
    </ul>
    <p>If you have restricted the processing of your personal data, these data – with the exception of their archiving – may be processed only subject to your consent or to claim, exercise or defend legal entitlements or to protect the rights of other natural persons or legal entities or for important public interest reasons cited by the European Union or a member state of the EU.</p>
    <h3>Rejection of unsolicited e-mails</h3>
    <p>We herewith object to the use of contact information published in conjunction with the mandatory information to be provided in section “Information Required by Law” to send us promotional and information material that we have not expressly requested. The operators of this website and its pages reserve the express right to take legal action in the event of the unsolicited sending of promotional information, for instance via SPAM messages.</p>
    <h2>3. Recording of data on our website</h2>
    <h3>Cookies</h3>
    <p>In some instances, our website and its pages use so-called cookies. Cookies do not cause any damage to your computer and do not contain viruses. The purpose of cookies is to make our website more user friendly, effective and more secure. Cookies are small text files that are placed on your computer and stored by your browser.</p>
    <p>Most of the cookies we use are so-called “session cookies.” They are automatically deleted after your leave our site. Other cookies will remain archived on your device until you delete them. These cookies enable us to recognise your browser the next time you visit our website.</p>
    <p>You can adjust the settings of your browser to make sure that you are notified every time cookies are placed and to enable you to accept cookies only in specific cases or to exclude the acceptance of cookies for specific situations or in general and to activate the automatic deletion of cookies when you close your browser. If you deactivate cookies, the functions of this website may be limited.</p>
    <p>Cookies that are required for the performance of the electronic communications transaction or to provide certain functions you want to use (e.g. the shopping cart function), are stored on the basis of Art. 6 Sect. 1 lit. f GDPR. The website operator has a legitimate interest in storing cookies to ensure the technically error free and optimised provision of the operator’s services. If other cookies (e.g. cookies for the analysis of your browsing patterns) should be stored, they are addressed separately in this Data Protection Declaration.</p>
    <h3>Server log files</h3> <p>The provider of this website and its pages automatically collects and stores information in so-called server log files, which your browser communicates to us automatically. The information comprises:</p>
    <ul>
        <li>The type and version of browser used</li>
        <li>The used operating system</li>
        <li>Referrer URL</li>
        <li>The hostname of the accessing computer</li>
        <li>The time of the server inquiry</li>
        <li>The IP address</li>
    </ul>
    <p>This data is not merged with other data sources.</p>
    <p>This data is recorded on the basis of Art. 6 Sect. 1 lit. f GDPR. The operator of the website has a legitimate interest in the technically error free depiction and the optimization of the operator’s website. In order to achieve this, server log files must be recorded.</p>
    <h3>Contact form</h3>
    <p>If you submit inquiries to us via our contact form, the information provided in the contact form as well as any contact information provided therein will be stored by us in order to handle your inquiry and in the event that we have further questions. We will not share this information without your consent.</p>
    <p>Hence, the processing of the data entered into the contact form occurs exclusively based on your consent (Art. 6 Sect. 1 lit. a GDPR). You have the right to revoke at any time any consent you have already given us. To do so, all you are required to do is sent us an informal notification via e-mail. This shall be without prejudice to the lawfulness of any data collection that occurred prior to your revocation.</p>
    <p>The information you have entered into the contact form shall remain with us until you ask us to eradicate the data, revoke your consent to the archiving of data or if the purpose for which the information is being archived no longer exists (e.g. after we have concluded our response to your inquiry). This shall be without prejudice to any mandatory legal provisions – in particular retention periods.</p>
    <h3>Request by e-mail, telephone or fax</h3>
    <p>If you contact us by e-mail, telephone or fax, your request, including all resulting personal data (name, request) will be stored and processed by us for the purpose of processing your request. We do not pass these data on without your consent.</p>
    <p>The processing of these data is based on Art. 6 para. 1 lit. b GDPR, if your request is related to the execution of a contract or if it is necessary to carry out pre-contractual measures. In all other cases, the processing is based on your consent (Article 6 (1) a GDPR) and/or on our legitimate interests (Article 6 (1) (f) GDPR), since we have a legitimate interest in the effective processing of requests addressed to us.</p>
    <p>The data sent by you to us via contact requests remain with us until you request us to delete, revoke your consent to the storage or the purpose for the data storage lapses (e.g. after completion of your request). Mandatory statutory provisions - in particular statutory retention periods - remain unaffected.</p>
    <h3>Processing of data (customer and contract data)</h3>
    <p>We collect, process and use personal data only to the extent necessary for the establishment, content organization or change of the legal relationship (data inventory). These actions are taken on the basis of Art. 6 Sect. 1 lit. b GDPR, which permits the processing of data for the fulfilment of a contract or pre-contractual actions. We collect, process and use personal data concerning the use of our website (usage data) only to the extent that this is necessary to make it possible for users to utilize the services and to bill for them.</p>
    <p>The collected customer data shall be eradicated upon completion of the order or the termination of the business relationship. This shall be without prejudice to any statutory retention mandates.</p>
    <h3>Data transfer upon closing of contracts for services and digital content</h3>
    <p>We share personal data with third parties only if this is necessary in conjunction with the handling of the contract; for instance, with the financial institution tasked with the processing of payments.</p>
    <p>Any further transfer of data shall not occur or shall only occur if you have expressly consented to the transfer. Any sharing of your data with third parties in the absence of your express consent, for instance for advertising purposes, shall not occur.</p>
    <p>The basis for the processing of data is Art. 6 Sect. 1 lit. b GDPR, which permits the processing of data for the fulfilment of a contract or for pre-contractual actions.</p>
    <h2>4. Newsletter</h2>
    <h3>Newsletter data</h3>
    <p>If you would like to subscribe to the newsletter offered on this website, we will need from you an e-mail address as well as information that allow us to verify that you are the owner of the e-mail address provided and consent to the receipt of the newsletter. No further data shall be collected or shall be collected only on a voluntary basis. We shall use such data only for the sending of the requested information and shall not share such data with any third parties.</p>
    <p>The processing of the information entered into the newsletter subscription form shall occur exclusively on the basis of your consent (Art. 6 Sect. 1 lit. a GDPR). You may revoke the consent you have given to the archiving of data, the e-mail address and the use of this information for the sending of the newsletter at any time, for instance by clicking on the &quot;Unsubscribe&quot; link in the newsletter. This shall be without prejudice to the lawfulness of any data processing transactions that have taken place to date.</p>
    <p>The data you archive with us for the purpose of the newsletter subscription shall be archived by us until you unsubscribe from the newsletter. Once you cancel your subscription to the newsletter, the data shall be deleted. This shall not affect data we have been archiving for other purposes.</p>
    <h2>5. Plug-ins and Tools</h2>
    <h3>YouTube with expanded data protection integration</h3> <p>Our website uses plug-ins of the YouTube platform, which is being operated by Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland.</p>
    <p>We use YouTube in the expanded data protection mode. According to YouTube, this mode ensures that YouTube does not store any information about visitors to this website before they watch the video. Nevertheless, this does not necessarily mean that the sharing of data with YouTube partners can be ruled out as a result of the expanded data protection mode. For instance, regardless of whether you are watching a video, YouTube will always establish a connection with the Google DoubleClick network.</p>
    <p>As soon as you start to play a YouTube video on our website, a connection to YouTube’s servers will be established. As a result, the YouTube server will be notified, which of our pages you have visited. If you are logged into your YouTube account while you visit our site, you enable YouTube to directly allocate your browsing patterns to your personal profile. You have the option to prevent this by logging out of your YouTube account.</p>
    <p>Furthermore, after you have started to play a video, YouTube will be able to place various cookies on your device. With the assistance of these cookies, YouTube will be able to obtain information about our website visitor. Among other things, this information will be used to generate video statistics with the aim of improving the user friendliness of the site and to prevent attempts to commit fraud. These cookies will stay on your device until you delete them.</p>
    <p>Under certain circumstances, additional data processing transactions may be triggered after you have started to play a YouTube video, which are beyond our control.</p>
    <p>The use of YouTube is based on our interest in presenting our online content in an appealing manner. Pursuant to Art. 6 Sect. 1 lit. f GDPR, this is a legitimate interest.</p>
    <p>For more information on how YouTube handles user data, please consult the YouTube Data Privacy Policy under: <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=en</a>.
    </p>
    <h3>Vimeo</h3> <p>Our website uses plug-ins of the video portal Vimeo. The provider is Vimeo Inc., 555 West 18th Street, New York, New York 10011, USA.</p>
    <p>If you visit one of the pages on our website into which a Vimeo plug-in has been integrated, a connection to Vimeo’s servers will be established. As a consequence, the Vimeo server will receive information as to which of our pages you have visited. Moreover, Vimeo will receive your IP address. This will also happen if you are not logged into Vimeo or do not have an account with Vimeo. The information recorded by Vimeo will be transmitted to Vimeo’s server in the United States.</p>
    <p>If you are logged into your Vimeo account, you enable Vimeo to directly allocate your browsing patterns to your personal profile. You can prevent this by logging out of your Vimeo account.</p>
    <p>The use of Vimeo is based on our interest in presenting our online content in an appealing manner. Pursuant to Art. 6 Sect. 1 lit. f GDPR, this is a legitimate interest.</p>
    <p>For more information on how Vimeo handles user data, please consult the Vimeo Data Privacy Policy under: <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer">https://vimeo.com/privacy</a>.</p>
    <h2>6. Payment service providers and resellers</h2>
    <h3>PayPal</h3>
    <p>Among other options, we offer payment via PayPal on our website. The provider of this payment processing service is PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg (hereinafter referred to as “PayPal”).</p>
    <p>If you choose payment via PayPal, we will share the payment information you enter with PayPal.</p>
    <p>The legal basis for the sharing of your data with PayPal is Art. 6 Sect. 1 lit. a GDPR (consent) as well as Art. 6 Sect. 1 lit. b GDPR (processing for the fulfilment of a contract). You have the option to at any time revoke your consent to the processing of your data. Such a revocation shall not have any impact on the effectiveness of data processing transactions that occurred in the past.</p>
    <h2>7. Custom Services</h2>
    <h3>Job Applications</h3>
    <p>We offer website visitors the opportunity to submit job applications to us (e.g. via e-mail, via postal services on by submitting the online job application form). Below, we will brief you on the scope, purpose and use of the personal data collected from you in conjunction with the application process. We assure you that the collection, processing and use of your data will occur in compliance with the applicable data privacy rights and all other statutory provisions and that your data will always be treated as strictly confidential. </p>
    <p><strong>Scope and purpose of the collection of data</strong></p>
    <p>If you submit a job application to us, we will process any affiliated personal data (e.g. contact and communications data, application documents, notes taken during job interviews, etc.), if they are required to make a decision concerning the establishment or an employment relationship. The legal grounds for the aforementioned are § 26 New GDPR according to German Law (Negotiation of an Employment Relationship), Art. 6 Sect. 1 lit. b GDPR (General Contract Negotiations) and – provided you have given us your consent – Art. 6 Sect. 1 lit. a GDPR. You may revoke any consent given at any time. Within our company, your personal data will only be shared with individuals who are involved in the processing of your job application.</p>
    <p>If your job application should result in your recruitment, the data you have submitted will be archived on the grounds of § 26 New GDPR and Art. 6 Sect. 1 lit. b GDPR for the purpose of implementing the employment relationship in our data processing system.</p>
    <p><strong>Data Archiving Period</strong></p>
    <p>If we should not be able to offer you a position, if you refuse a job offer, retract your application, revoke your consent to the processing of your data or ask us to delete your data, we will store your transferred data, incl. any physically submitted application documents for a maximum of 6 months after the conclusion of the application process (retention period) to enable us to track the details of the application process in the event of disparities (Art. 6 Sect. 1 lit. f GDPR).</p>
    <p>YOU HAVE THE OPTION TO OBJECT TO THIS STORAGE/RETENTION OF YOUR DATA IF YOU HAVE LEGITIMATE INTERESTS TO DO SO THAT OUTWEIGH OUR INTERESTS.</p>
    <p>Once the retention period has expired, the data will be deleted, unless we are subject to any other statutory retention obligations or if any other legal grounds exist to continue to store the data. If it should be foreseeable that the retention of your data will be necessary after the retention period has expired (e.g. due to imminent or pending litigation), the data shall not be deleted until the data have become irrelevant. This shall be without prejudice to any other statutory retention periods.</p>
</DocsHandler>;

export {PageImpress, PagePrivacy}
