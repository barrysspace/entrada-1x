<?php
/**
 * Entrada [ http://www.entrada-project.org ]
 *
 * @author Organisation: Queen's University
 * @author Unit: School of Medicine
 * @author Developer: Jonathan Fingland <jonathan.fingland@queensu.ca>
 * @copyright Copyright 2010 Queen's University. All Rights Reserved.
 *
 * @version $Id: incident-edit.inc.php 1094 2010-04-04 17:25:34Z simpson $
*/

if ((!defined("PARENT_INCLUDED")) || (!defined("IN_OBSERVERSHIPS"))) {
	exit;
} elseif ((!isset($_SESSION["isAuthorized"])) || (!$_SESSION["isAuthorized"])) {
	header("Location: ".ENTRADA_URL);
	exit;
} elseif (!$ENTRADA_ACL->amIAllowed("observerships", "read", false)) {
	$ERROR++;
	$ERRORSTR[]	= "You do not have the permissions required to use this module.<br /><br />If you believe you are receiving this message in error please contact <a href=\"mailto:".html_encode($AGENT_CONTACTS["administrator"]["email"])."\">".html_encode($AGENT_CONTACTS["administrator"]["name"])."</a> for assistance.";

	echo display_error();

	application_log("error", "Group [".$GROUP."] and role [".$ROLE."] do not have access to this module [".$MODULE."]");
} else {
	define("IN_OBSERVERSHIPS_FACULTY", true);

	//$BREADCRUMB[] = array("url" => ENTRADA_URL."/admin/users/manage/incidents?id=".$PROXY_ID, "title" => "Manage Incidents");
	echo "Observership Faculty";
	
	if (($router) && ($router->initRoute())) {
		$module_file = $router->getRoute();
		if ($module_file) {
			require_once($module_file);
		}
	} else {
		$url = ENTRADA_URL;
		application_log("error", "The Entrada_Router failed to load a request. The user was redirected to [".$url."].");

		header("Location: ".$url);
		exit;
	}
}
