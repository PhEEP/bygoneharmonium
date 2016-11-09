var jsdom = require('jsdom');
var bygones = require('./data/bygones.js');
var frame = require('./data/sample_report.js');

exports.populateFrame = function(id) {
     var filebase = "./data/raw_html/";
    var file = filebase + id + '.html';
    var newFrame = frame();
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('Successfully loaded file!');
            jsdom.env(
                data, ["http://code.jquery.com/jquery.js"],
                function(err, window) {

                    newFrame.case_report_title = window.$('.block').text();
                    newFrame.case_status = window.$('label[for="case_status"]').parent('td').next('td').text();
                    newFrame.case_number = window.$('label[for="case_case_number"]').parent('td').next('td').text();
                    newFrame.date_found = moment(window.$('label[for="case_date_found_2i"]').parent('td').next('td').text())._d;
                    newFrame.date_created = moment(window.$('label:contains("Date created")').parent('td').next('td').text())._d;
                    newFrame.date_last_modified = moment(window.$('label:contains("Date last modified")').parent('td').next('td').text())._d;
                    newFrame.case_qa_reviewed_date = moment(window.$('label[for="case_date_found_2i"]').parent('td').next('td').text())._d;
                    newFrame.current_contact.agency = window.$('#case_information > div:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
                    newFrame.current_contact.phone = window.$('#case_information > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                    newFrame.case_manager.name = window.$('#case_information > div.column2-unit-right > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
                    newFrame.case_manager.phone = window.$('#case_information > div.column2-unit-right > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                    newFrame.case_estimated_age = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
                    newFrame.case_minimum_age = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                    newFrame.case_maximum_age = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
                    newFrame.case_race = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
                    newFrame.case_ethnicity = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
                    newFrame.case_sex = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(6) > td:nth-child(2)').text();
                    newFrame.case_weight = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(7) > td:nth-child(2)').text();
                    newFrame.case_height = window.$('#demographics > div.column2-unit-left > table > tbody > tr:nth-child(8) > td:nth-child(2)').text();
                    newFrame.case_body_inventory_all_parts_recovered = window.$('#case_body_inventory_all_parts_recovered').attr('checked');
                    newFrame.case_body_inventory_head_not_recovered = window.$('#case_body_inventory_head_not_recovered').attr('checked');
                    newFrame.case_body_inventory_torso_not_recovered = window.$('#case_body_inventory_torso_not_recovered').attr('checked');
                    newFrame.case_body_inventory_limbs_not_recovered = window.$('#case_body_inventory_limbs_not_recovered').attr('checked');
                    newFrame.case_body_inventory_hands_not_recovered = window.$('#case_body_inventory_hands_not_recovered').attr('checked');
                    newFrame.case_body_condition = window.$('#demographics > div.column2-unit-right.non-living > table:nth-child(2) > tbody > tr:nth-child(2) > td').text();
                    newFrame.case_minimum_year_of_death = window.$('#demographics > div.column1-unit.non-living > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
                    newFrame.case_postmortem_interval = window.$('#demographics > div.column1-unit.non-living > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                    newFrame.case_gps_coordinates = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                    newFrame.case_address_found_1 = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
                    newFrame.case_address_found_2 = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
                    newFrame.case_city_found = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
                    newFrame.case_state_found_id = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(6) > td:nth-child(2)').text();
                    newFrame.case_zip_found = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(7) > td:nth-child(2)').text();
                    newFrame.case_county_found_id = window.$('#circumstances > div.column2-unit-left > table > tbody > tr:nth-child(8) > td:nth-child(2)').text();
                    newFrame.case_circumstances = window.$('#case_circumstances').text();
                    newFrame.case_hair_color = window.$('#physical_medical > div > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(3)').text();
                    newFrame.case_head_hair = window.$('#case_head_hair').text();
                    newFrame.case_body_hair = window.$('#case_body_hair').text();
                    newFrame.case_facial_hair = window.$('#case_facial_hair').text();
                    newFrame.case_eye_color_left = window.$('#physical_medical > div > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(3)').text();
                    newFrame.case_eye_color_right = window.$('#physical_medical > div > table:nth-child(2) > tbody > tr:nth-child(6) > td:nth-child(3)').text();
                    newFrame.case_eye_description = window.$('#case_eye_description').text();
                    newFrame.case_amputations_details = window.$('#case_amputations').attr('checked');
                    newFrame.case_deformities_details = window.$('#case_deformities').attr('checked');
                    newFrame.case_scars_and_marks_details = window.$('#case_scars_and_marks').attr('checked');
                    newFrame.case_tattoos_details = window.$('#case_tattoos').attr('checked');
                    newFrame.case_piercings_details = window.$('#case_piercings').attr('checked');
                    newFrame.case_artificial_body_parts_and_aids_details = window.$('#case_artificial_body_parts_and_aids').attr('checked');
                    newFrame.case_finger_and_toe_nails_details = window.$('#case_finger_and_toe_nails').attr('checked');
                    newFrame.case_physical_other_details = window.$('#case_physical_other').attr('checked');
                    newFrame.case_medical_implants_details = window.$('#case_medical_implants_details').attr('checked');
                    newFrame.case_foreign_objects_details = window.$('#case_foreign_objects_details').attr('checked');
                    newFrame.case_skeletal_findings_details = window.$('#case_skeletal_findings_details').attr('checked');
                    newFrame.case_organ_absent_details = window.$('#case_organ_absent_details').attr('checked');
                    newFrame.case_prior_surgery_details = window.$('#case_prior_surgery_details').attr('checked');
                    newFrame.case_medical_other_details = window.$('#case_medical_other_details').attr('checked');
                    newFrame.fingerprints = window.$('#fingerprints > table > tbody > tr > td.view_field').text();
                    //   newFrame.clothing_accessories = window.$('').text();
                    newFrame.case_clothing_on_body = window.$('#case_clothing_on_body').text();
                    newFrame.case_clothing_with_body = window.$('#case_clothing_with_body').text();
                    newFrame.case_footwear = window.$('#case_footwear').text();
                    newFrame.case_jewelry = window.$('#case_jewelry').text();
                    newFrame.case_eyewear = window.$('#case_eyewear').text();
                    newFrame.case_other_items_with_body = window.$('#case_other_items_with_body').text();
                    newFrame.dental = window.$('#dental > table > tbody > tr > td.view_field').text();
                    newFrame.dna = window.$('#dna > table > tbody > tr > td.view_field').text();
                    var imgobj = window.$('img');
                    if (imgobj !== undefined) {
                        for (var i = 0; i < imgobj.length; i++) {
                            newFrame.images.push(window.$('img:eq(' + i + ')').attr('src'));
                        }
                    }
                    newFrame.documents = window.$('body > div > div > div:nth-child(21) > table > tbody > tr > td').html();

                    fs.writeFile('./data/json/' + id + '.json', JSON.stringify(newFrame), 'utf8', function(err) {
                            if (err) {
                                console.log('error', err);
                            } else {
                                console.log('ID ' + id + ' Saved!');
                            }
                       });
                });
        }
    });
}
