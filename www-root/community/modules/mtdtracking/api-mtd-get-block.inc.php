<?php

/**
 * Entrada [ http://www.entrada-project.org ]
 *
 * Fetches the start and end dates for a given block.
 *
 * @author Organisation: Queen's University
 * @author Unit: School of Medicine
 * @author Developer: Don Zuiker <don.zuiker@queensu.ca>
 * @copyright Copyright 2011 Queen's University. All Rights Reserved.
 *
 */
if (!defined("IN_MTDTRACKING")) {
	exit;
} elseif ((!isset($_SESSION["isAuthorized"])) || (!$_SESSION["isAuthorized"])) {
	header("Location: " . ENTRADA_URL);
	exit;
} else {

	@set_include_path(implode(PATH_SEPARATOR, array(
						dirname(__FILE__) . "/../core",
						dirname(__FILE__) . "/../core/includes",
						dirname(__FILE__) . "/../core/library",
						get_include_path(),
					)));

	/**
	 * Include the Entrada init code.
	 */
	require_once("init.inc.php");

	/**
	 * Clears all open buffers so we can return a plain response for the Javascript.
	 */
	ob_clear_open_buffers();

	//Retrieve block dates from the database based on the block selected.
	//1. Determine the year we are in. e.g. "2010-2011"
	//2. select the start and end dates based on the selected block.
	$current_date = date("Y-m-d");
	$date_arr = date_parse($current_date);
	$year = "";
	if ($date_arr["month"] >= 7) {
		$year = $date_arr["year"] . "-" . strval(intval($date_arr["year"]) + 1);
	} else {
		$year = strval(intval($date_arr["year"]) - 1) . "-" . $date_arr["year"];
	}

	$block = clean_input($_GET['block'], array("notags", "trim", "nows"));

	$query = "SELECT *
				  FROM `pg_blocks`
				  WHERE `block_name` = " . $db->qstr($block) . "
				  AND year = " . $db->qstr($year);
	$result = $db->GetRow($query);

	$start_date = new DateTime($result["start_date"]);
	$end_date = new DateTime($result["end_date"]);

	echo "<span>Block " . $block . " selected<br />  Start: " . $start_date->format('F jS, Y') . "<br />  End: " . $end_date->format('F jS, Y') . "</span>";

	exit();
}
?>